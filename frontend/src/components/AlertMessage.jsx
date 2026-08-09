/**
 * AlertMessage Component
 *
 * A reusable Bootstrap alert.
 *
 * Responsibilities:
 *
 * 1. Display success, error, warning or info messages.
 * 2. Allow user to dismiss the alert.
 */

function AlertMessage({

    type,

    message,

    onClose

}) {

    if (!message) {

        return null;

    }

    return (

        <div

            className={`alert alert-${type} alert-dismissible fade show`}

            role="alert"

        >

            {message}

            <button

                type="button"

                className="btn-close"

                onClick={onClose}

            >

            </button>

        </div>

    );

}

export default AlertMessage;