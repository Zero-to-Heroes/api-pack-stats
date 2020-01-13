import SqlString from 'sqlstring';
import { getConnection } from './db/rds';

// This example demonstrates a NodeJS 8.10 async handler[1], however of course you could use
// the more traditional callback-style handler.
// [1]: https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/
export default async (event): Promise<any> => {
	try {
		// console.log('input', JSON.stringify(event));
		const packStat = JSON.parse(event.body);
		// console.log('getting stats for review', reviewId);
		const mysql = await getConnection();
		const escape = SqlString.escape;
		const results = await mysql.query(
			`
				INSERT INTO pack_stat 
				(
					card1Id, card1Rarity, card1Type, 
					card2Id, card2Rarity, card2Type,
					card3Id, card3Rarity, card3Type,
					card4Id, card4Rarity, card4Type,
					card5Id, card5Rarity, card5Type,
					creationDate,
					setId,
					userId, userMachineId,
					userName
				)
				VALUES
				(
					${escape(packStat.card1Id)}, ${escape(packStat.card1Rarity)}, ${escape(packStat.card1Type)},
					${escape(packStat.card2Id)}, ${escape(packStat.card2Rarity)}, ${escape(packStat.card2Type)},
					${escape(packStat.card3Id)}, ${escape(packStat.card3Rarity)}, ${escape(packStat.card3Type)},
					${escape(packStat.card4Id)}, ${escape(packStat.card4Rarity)}, ${escape(packStat.card4Type)},
					${escape(packStat.card5Id)}, ${escape(packStat.card5Rarity)}, ${escape(packStat.card5Type)},
					${escape(packStat.creationDate)}, 
					${escape(packStat.setId)}, 
					${escape(packStat.userId)}, ${escape(packStat.userMachineId)}, 
					${escape(packStat.userName)}
				)
			`,
		);
		const response = {
			statusCode: 200,
			isBase64Encoded: false,
			body: JSON.stringify({ results }),
		};
		// console.log('sending back success reponse');
		return response;
	} catch (e) {
		console.error('issue saving pack stat', e);
		const response = {
			statusCode: 500,
			isBase64Encoded: false,
			body: JSON.stringify({ message: 'not ok', exception: e }),
		};
		console.log('sending back error reponse', response);
		return response;
	}
};
