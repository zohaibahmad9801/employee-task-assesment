/**
 * Update Status Modal
 *
 * Allows an employee to update the status
 * of an assigned task.
 */

function UpdateStatusModal({
    show,
    task,
    status,
    onStatusChange,
    onClose,
    onConfirm
}) {

    if (!show) {

        return null;

    }


    return (

        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
        >

            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content">


                    {/* Header */}

                    <div className="modal-header">

                        <h5 className="modal-title">

                            Update Task Status

                        </h5>

                        <button

                            type="button"

                            className="btn-close"

                            onClick={onClose}

                        ></button>

                    </div>


                    {/* Body */}

                    <div className="modal-body">

                        <p className="mb-3">

                            Update status for:

                            <strong className="ms-1">

                                {task?.title}

                            </strong>

                        </p>


                        <div className="mb-3">

                            <label className="form-label">

                                Status

                            </label>

                            <select

                                className="form-select"

                                value={status}

                                onChange={(event) =>
                                    onStatusChange(
                                        event.target.value
                                    )
                                }

                            >

                                <option value="TODO">

                                    TODO

                                </option>

                                <option value="IN_PROGRESS">

                                    IN_PROGRESS

                                </option>

                                <option value="DONE">

                                    DONE

                                </option>

                            </select>

                        </div>

                    </div>


                    {/* Footer */}

                    <div className="modal-footer">

                        <button

                            type="button"

                            className="btn btn-outline-secondary"

                            onClick={onClose}

                        >

                            Cancel

                        </button>


                        <button

                            type="button"

                            className="btn btn-primary"

                            onClick={onConfirm}

                        >

                            Update Status

                        </button>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default UpdateStatusModal;