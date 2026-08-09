/**
 * Empty State Component
 *
 * Displayed when no data exists.
 */

function EmptyState({

    message

}) {

    return (

        <div
            className="text-center py-5 text-muted"
        >

            <h5>

                {message}

            </h5>

        </div>

    );

}

export default EmptyState;