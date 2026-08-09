/**
 * Confirmation Modal
 *
 * A reusable confirmation dialog that can be used
 * before deleting or performing any destructive action.
 */

function ConfirmationModal({

    title,

    message,

    show,

    onClose,

    onConfirm,

    confirmButtonText = "Confirm",

    confirmButtonClass = "btn btn-primary"

}) {

    if (!show) {

        return null;

    }

    return (

        <div
            className="modal fade show"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5 className="modal-title">

                            {title}

                        </h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        />

                    </div>

                    <div className="modal-body">

                        <p>

                            {message}

                        </p>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >

                            Cancel

                        </button>

                        <button
                            className={confirmButtonClass}
                            onClick={onConfirm}
                        >
                            {confirmButtonText}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ConfirmationModal;