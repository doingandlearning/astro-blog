import { useState } from 'preact/hooks';
import * as Yup from 'yup';
import { z } from "astro:content"

const SubscribeSchema = Yup.object().shape({
	email_address: Yup.string().email('Invalid email address').required('Required'),
	first_name: Yup.string(),
});

const PostSubmissionMessage = () => {
	return (
		<div className="text-2xl text-center">
			<p>Great, one last thing...</p>
			<p>I just sent you an email.</p>
		</div>
	);
};

function ErrorMessage({ errors, name }) {
	return <div className="text-red-700">{errors[name] && <p>{errors.name.message}</p>}</div>;
}

export default function SignUp({ formid = 1697448, children, shutModal = null }) {
	const [submitted, setSubmitted] = useState(false);
	const [response, setResponse] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const handleSubmit = async (values) => {
		setSubmitted(true);
		try {
			const response = await fetch(`https://app.convertkit.com/forms/${formid}/subscriptions`, {
				method: 'post',
				body: JSON.stringify(values, null, 2),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const responseJson = await response.json();
			setResponse(responseJson);
			setErrorMessage(null);
			if (shutModal) {
				shutModal();
			}
		} catch (error) {
			setSubmitted(false);
			setErrorMessage('Something went wrong!');
		}
	};

	const successful = response && response.status === 'success';
	return (
		<div>

			{!successful && (
				<>
					{children && <div className="mx-auto sm:px-6 text-3xl lg:text-5xl my-auto">{children}</div>}
					<form className="mx-auto m-4 my-auto ">
						<div className="flex flex-col md:flex-row justify-between">
							<label htmlFor="first_name">
								<div className="pt-4">
									<p className="p-2 font-normal text-lg">First name</p>
									<input
										aria-label="your first name"
										aria-required="false"
										name="first_name"
										placeholder="Jane"
										type="text"
										className="text-2xl rounded-xl p-2 my-auto bg-slate-100 mr-3 border-1 border-primary"
									/>
									<ErrorMessage errors={errors} />
								</div>
							</label>
							<label htmlFor="email">
								<div className="pt-4 ">
									<p className="p-2 font-normal text-lg">Email</p>
									<input
										aria-label="your email address"
										aria-required="true"
										name="email_address"
										placeholder="jane@acme.com"
										type="email"
										className="text-2xl rounded-xl p-2 my-auto bg-slate-100 md:ml-2"
									/>
									<ErrorMessage name="email_address" component="span" className="text-red-700" />
								</div>
							</label>
						</div>
						<div className="flex justify-end">
							{shutModal && (
								<button
									type="not-submit"
									onClick={() => shutModal()}
									className="bg-slate-200 text-primary px-8 py-2 mx-2 my-3 rounded-xl mt-6"
								>
									Close
								</button>
							)}
							<button
								data-element="submit"
								type="submit"
								disabled={isSubmitting}
								className="bg-primary text-white px-8 py-2 mx-2 my-3 rounded-xl mt-6"
							>
								{!isSubmitting && 'Subscribe!'}
								{isSubmitting && 'Subscribing...'}
							</button>
						</div>
					</form>
				</>
			)
			}
			{submitted && !isSubmitting && <p>Submitting!</p>}
			{errorMessage && <div>{errorMessage}</div>}

		</div >
	)

}
