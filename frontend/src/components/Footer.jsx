/**
 * Footer Component
 *
 * A reusable footer for the application.
 */

function Footer() {

    return (

        <footer
            className="text-white mt-5"
            style={{
                backgroundColor: "#0A3FAF"
            }}
        >

            <div className="container py-4">

                <div className="text-center">

                    <h6 className="fw-bold mb-1">

                        AL NADA EXCHANGE

                    </h6>

                    <small>

                        Employee Task Management Portal

                    </small>

                    <div
                        className="border-top border-light opacity-25 my-3"
                    ></div>

                    <small>

                        © 2026 Al Nada Exchange. All rights reserved.

                    </small>

                </div>

            </div>

        </footer>

    );

}

export default Footer;