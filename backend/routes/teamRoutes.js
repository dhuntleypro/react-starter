import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Team from '../models/teamModel.js';
import { isAuth, isAdmin } from '../utils.js';

const teamRouter = express.Router();

teamRouter.get('/', async (req, res) => {
  const teams = await Team.find();
  res.send(teams);
});

teamRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newTeam = new Team({
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
    const team = await newTeam.save();
    res.send({ message: 'Team Created', team });
  })
);

teamRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (team) {
      team.name = req.body.name;
      team.slug = req.body.slug;
      team.price = req.body.price;
      team.image = req.body.image;
      team.images = req.body.images;
      team.category = req.body.category;
      team.brand = req.body.brand;
      team.countInStock = req.body.countInStock;
      team.description = req.body.description;
      await team.save();
      res.send({ message: 'Team Updated' });
    } else {
      res.status(404).send({ message: 'Team Not Found' });
    }
  })
);

teamRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (team) {
      await team.remove();
      res.send({ message: 'Team Deleted' });
    } else {
      res.status(404).send({ message: 'Team Not Found' });
    }
  })
);

teamRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if (team) {
      if (team.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      team.reviews.push(review);
      team.numReviews = team.reviews.length;
      team.rating =
        team.reviews.reduce((a, c) => c.rating + a, 0) / team.reviews.length;
      const updatedTeam = await team.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedTeam.reviews[updatedTeam.reviews.length - 1],
        numReviews: team.numReviews,
        rating: team.rating,
      });
    } else {
      res.status(404).send({ message: 'Team Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

teamRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const teams = await Team.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countTeams = await Team.countDocuments();
    res.send({
      teams,
      countTeams,
      page,
      pages: Math.ceil(countTeams / pageSize),
    });
  })
);

teamRouter.get(
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

    const teams = await Team.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countTeams = await Team.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      teams,
      countTeams,
      page,
      pages: Math.ceil(countTeams / pageSize),
    });
  })
);

teamRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Team.find().distinct('category');
    res.send(categories);
  })
);

teamRouter.get('/slug/:slug', async (req, res) => {
  const team = await Team.findOne({ slug: req.params.slug });
  if (team) {
    res.send(team);
  } else {
    res.status(404).send({ message: 'Team Not Found' });
  }
});
teamRouter.get('/:id', async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (team) {
    res.send(team);
  } else {
    res.status(404).send({ message: 'Team Not Found' });
  }
});

export default teamRouter;
