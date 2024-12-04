"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const songRouter = require('express').Router();
const axios = require('axios');
require('dotenv').config();
const GENIUS_ENDPOINT = 'https://api.genius.com';
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;
/**
 * GET /api/song
 * @summary Fetches 3 random songs from the Genius API
 * @tags song
 * @return {array<Song>} 200 - An array of 3 random songs
 * @return {Error} 500 - Internal server error
 */
songRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get(`${GENIUS_ENDPOINT}/songs/378195`, {
            headers: {
                Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`
            },
            params: {
                per_page: 3,
                page: 1
            }
        });
        const songs = response.data.response.songs;
        res.status(200).json(songs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
module.exports = songRouter;
//# sourceMappingURL=index.js.map