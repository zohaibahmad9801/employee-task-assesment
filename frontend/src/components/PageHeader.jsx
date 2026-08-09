/**
 * PageHeader Component
 *
 * A reusable page header for all admin pages.
 *
 * Responsibilities:
 *
 * 1. Display page title.
 * 2. Display page subtitle.
 * 3. Optionally display an action button.
 */

function PageHeader({

    title,

    subtitle,

    buttonText,

    onButtonClick,

    backText,

    onBackClick

}) {

    return (

        <div
            className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4"
            style={{
                backgroundColor: "#F4F9FF",
                border: "1px solid #E3EEFF"
            }}
        >

            <div>

                <h2
                    className="fw-bold mb-1"
                    style={{
                        color: "#0A3FAF"
                    }}
                >

                    {title}

                </h2>

                <p className="text-muted mb-0">

                    {subtitle}

                </p>

            </div>

            <div className="d-flex align-items-center gap-2">

                {

                    onBackClick && (

                        <button

                            className="btn btn-outline-secondary"

                            onClick={onBackClick}

                        >

                            {backText || "← Back"}

                        </button>

                    )

                }

                {

                    buttonText && (

                        <button

                            className="btn btn-primary"

                            onClick={onButtonClick}

                        >

                            {buttonText}

                        </button>

                    )

                }

            </div>

        </div>

    );

}

export default PageHeader;