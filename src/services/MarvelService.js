import { PUBLIC_KEY } from "../env/keys.js";

const _apiBase = 'https://gateway.marvel.com:443/v1/public/'

class MarvelService {
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${_apiBase}characters?limit=9&offset=210&apikey=${PUBLIC_KEY}`)
    }

    getCharacter = (id) => {
        return this.getResource(`${_apiBase}characters/${id}id?apikey=${PUBLIC_KEY}`)
    }
}

export default MarvelService;