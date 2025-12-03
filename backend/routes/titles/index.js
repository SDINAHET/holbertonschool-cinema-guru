const express = require('express')
const router = express.Router()
const { Title } = require('../../models/Title')
const { verifyToken } = require('../../utils/tokens')
const { Op } = require('@sequelize/core');
const userTitlesRouter = require('./userTitles')
const axios = require('axios')

/**
 * @swagger
 * tags:
 *   name: Titles
 *   description: IMDb titles management
 */
router.use('/', userTitlesRouter)


/**
 * @swagger
 * /api/titles/advancedsearch:
 *   get:
 *     summary: Advanced movie search
 *     tags: [Titles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: maxYear
 *         in: query
 *         schema:
 *           type: integer
 *         description: Maximum release year
 *       - name: minYear
 *         in: query
 *         schema:
 *           type: integer
 *         description: Minimum release year
 *       - name: genres
 *         in: query
 *         schema:
 *           type: string
 *         description: Comma-separated genres
 *       - name: sort
 *         in: query
 *         schema:
 *           type: string
 *           enum: [oldest, latest, highestrated, lowestrated]
 *       - name: title
 *         in: query
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results returned
 */
router.get('/advancedsearch', verifyToken, async (req, res) => {
    const maxYear = parseInt(req.query.maxYear)
    const minYear = parseInt(req.query.minYear)
    const genre = req.query.genres ? req.query.genres.split(',').map(genre => genre.charAt(0).toUpperCase() + genre.slice(1)) : []
    const params = {
        maxYear: isNaN(maxYear) ? 2022 : maxYear,
        minYear: isNaN(minYear) ? 0 : minYear,
        sort: req.query.sort ?? "",
        genres: genre,
        title: req.query.title ? req.query.title : "",
        page: req.query.page ? req.query.page : 1,
    }
    const titles = await Title.findAll({
        where: {
            released: {
                [Op.between]: [params.minYear, params.maxYear]
            },
            genres: {
                [Op.contains]: params.genres ? params.genres : true
            },
            title: {
                [Op.iLike]: `%${params.title}%`
            }
        },
        order: [getSort(params.sort)],
        limit: params.page * 50,
    }).catch(err => res.status(500).send(err))
    res.send({ totalCount: titles.length, titles })
})

/**
 * @swagger
 * /api/titles/{imdbId}:
 *   get:
 *     summary: Get one title by IMDb ID
 *     tags: [Titles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDb identifier (e.g. tt1234567)
 *     responses:
 *       200:
 *         description: Title found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Title'
 *       404:
 *         description: Title not found
 *       500:
 *         description: Server error
 */
// router.get('/:imdbId', verifyToken, (req, res) => {
//     const { imdbId } = req.params
//     Title.findOne({ where: { imdbId } }).then(data => res.send(data)).catch(err => res.status(500).send(err))
// })
router.get('/:imdbId', verifyToken, async (req, res) => {
  const { imdbId } = req.params;

  try {
    const title = await Title.findOne({ where: { imdbId } });

    if (!title) {
      return res.status(404).json({ message: 'Title not found' });
    }

    res.json(title);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const getSort = (param) => {
    switch (param) {
        case "oldest":
            return ['released', 'ASC']
        case "highestrated":
            return ['imdbrating', 'DESC']
        case "lowestrated":
            return ['imdbrating', 'ASC']
        default:
            return ['released', 'DESC']
    }
}

module.exports = router
