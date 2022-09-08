import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Campaign from '../models/campaignModel.js';
import { isAuth, isAdmin } from '../utils.js';

const campaignRouter = express.Router();

campaignRouter.get('/', async (req, res) => {
  const campaigns = await Campaign.find();
  res.send(campaigns);
});

campaignRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newCampaign = new Campaign({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const campaign = await newCampaign.save();
    res.send({ message: 'Campaign Created', campaign });
  })
);

campaignRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      campaign.name = req.body.name;
      campaign.slug = req.body.slug;
      campaign.price = req.body.price;
      campaign.image = req.body.image;
      campaign.images = req.body.images;
      campaign.category = req.body.category;
      campaign.brand = req.body.brand;
      campaign.countInStock = req.body.countInStock;
      campaign.description = req.body.description;
      await campaign.save();
      res.send({ message: 'Campaign Updated' });
    } else {
      res.status(404).send({ message: 'Campaign Not Found' });
    }
  })
);

campaignRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      await campaign.remove();
      res.send({ message: 'Campaign Deleted' });
    } else {
      res.status(404).send({ message: 'Campaign Not Found' });
    }
  })
);

campaignRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const campaignId = req.params.id;
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      if (campaign.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      campaign.reviews.push(review);
      campaign.numReviews = campaign.reviews.length;
      campaign.rating =
        campaign.reviews.reduce((a, c) => c.rating + a, 0) /
        campaign.reviews.length;
      const updatedCampaign = await campaign.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedCampaign.reviews[updatedCampaign.reviews.length - 1],
        numReviews: campaign.numReviews,
        rating: campaign.rating,
      });
    } else {
      res.status(404).send({ message: 'Campaign Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

campaignRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const campaigns = await Campaign.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countCampaigns = await Campaign.countDocuments();
    res.send({
      campaigns,
      countCampaigns,
      page,
      pages: Math.ceil(countCampaigns / pageSize),
    });
  })
);

campaignRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const campaigns = await Campaign.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countCampaigns = await Campaign.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      campaigns,
      countCampaigns,
      page,
      pages: Math.ceil(countCampaigns / pageSize),
    });
  })
);

campaignRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Campaign.find().distinct('category');
    res.send(categories);
  })
);

campaignRouter.get('/slug/:slug', async (req, res) => {
  const campaign = await Campaign.findOne({ slug: req.params.slug });
  if (campaign) {
    res.send(campaign);
  } else {
    res.status(404).send({ message: 'Campaign Not Found' });
  }
});
campaignRouter.get('/:id', async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (campaign) {
    res.send(campaign);
  } else {
    res.status(404).send({ message: 'Campaign Not Found' });
  }
});

export default campaignRouter;
