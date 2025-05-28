const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const {
      q = '',
      category = '',
      filters = '{}',
      page = 1,
      limit = 20
    } = req.query;

    let parsedFilters;
    try {
      parsedFilters = JSON.parse(decodeURIComponent(filters));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid filters format' });
    }

    const query = {};

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }

    if (Object.keys(parsedFilters).length > 0) {
      const attributeQueries = Object.entries(parsedFilters).map(([key, value]) => ({
        [`attributes.${key}`]: value
      }));
      
      if (attributeQueries.length > 0) {
        query.$and = attributeQueries;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sort = { createdAt: -1 };
    if (q) {
      sort = {
        score: { $meta: 'textScore' },
        createdAt: -1
      };
    }

    const [listings, total, categoryDoc] = await Promise.all([
      Listing.find(query, q ? { score: { $meta: 'textScore' } } : null)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('categoryId'),
      Listing.countDocuments(query),
      category ? Category.findOne({ slug: category }) : null
    ]);

    const facets = {
      priceRanges: await Listing.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            min: { $min: '$price' },
            max: { $max: '$price' },
            avg: { $avg: '$price' }
          }
        }
      ])
    };

    if (categoryDoc) {
      const attributeFacets = await Promise.all(
        categoryDoc.attributeSchema.map(async (attr) => {
          const facetData = await Listing.aggregate([
            { $match: query },
            {
              $group: {
                _id: `$attributes.${attr.name}`,
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } }
          ]);

          return {
            name: attr.name,
            type: attr.type,
            values: facetData.map(f => ({
              value: f._id,
              count: f.count
            }))
          };
        })
      );

      facets.attributes = attributeFacets;
    }

    res.json({
      results: listings,
      facets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;