/**
 * Loading Spinner
 *
 * Displays a loading spinner while data
 * is being fetched.
 */

function LoadingSpinner() {

    return (

        <div
            className="d-flex justify-content-center py-5"
        >

            <div
                className="spinner-border text-primary"
                role="status"
            >

            </div>

        </div>

    );

}

export default LoadingSpinner;