const axios = require('axios');

exports.handler = async function(event, context) {
    const { gameName } = JSON.parse(event.body);
    
    const igdbEndpoint = 'https://api.igdb.com/v4/games';
    const clientId = process.env.IGDB_CLIENT_ID;
    const accessToken = process.env.IGDB_ACCESS_TOKEN;

    try {
        const response = await axios({
            url: igdbEndpoint,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`,
            },
            data: `fields name,platforms.name,genres.name,first_release_date; search "${gameName}"; limit 1;`
        });

        const gameData = response.data[0];
        
        if (gameData) {
            const platforms = gameData.platforms ? gameData.platforms.map(p => p.name).join(', ') : 'Unknown';
            const genres = gameData.genres ? gameData.genres.map(g => g.name).join(', ') : 'Unknown';
            const releaseDate = gameData.first_release_date ? new Date(gameData.first_release_date * 1000).toLocaleDateString() : 'Unknown';

            return {
                statusCode: 200,
                body: JSON.stringify({
                    platforms,
                    genres,
                    releaseDate
                })
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Game not found' })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch game details' })
        };
    }
};