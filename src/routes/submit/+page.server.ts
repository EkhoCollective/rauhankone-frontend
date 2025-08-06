// import type { PageServerLoad } from './$types';

// 	const API_QUESTIONS_OPTIONS = () => ({
// 		API_ENDPOINT: '/get_questions',
// 		API_METHOD: 'POST',
// 		REQUEST_BODY: { question_type: 'starter' }
// 	});

// export const load: PageServerLoad = async ({ params }) => {
// 	const post = await getPostFromDatabase(params.slug);

// 	if (post) {
// 		return post;
// 	}

// 	error(404, 'Not found');
// };

// 	// async function handleGetToken() {
// 	// 	await getAuthToken()
// 	// 		.then(() => {
// 	// 			handleGetQuestions();
// 	// 		})
// 	// 		.catch((error) => {
// 	// 			console.log('Error getting token', error);
// 	// 			raiseError = true;
// 	// 		});
// 	// }


//   	// async function handleGetQuestions() {
// 	// 	await apiRequest(API_QUESTIONS_OPTIONS())
// 	// 		.then((response) => {
// 	// 			questions = response;
// 	// 		})
// 	// 		.catch((error) => {
// 	// 			console.log('Error getting questions', error);
// 	// 			raiseError = true;
// 	// 		});
// 	// }