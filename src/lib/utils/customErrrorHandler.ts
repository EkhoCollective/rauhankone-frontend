import { goto } from "$app/navigation";


const customErrorHandler = (errorMessage: string, errorCode: number) => {
    console.error(`Custom Error Handler: ${errorMessage} (Code: ${errorCode})`);
	goto(`/error?message=${encodeURIComponent(errorMessage)}&code=${errorCode}`);
};


export { customErrorHandler };
