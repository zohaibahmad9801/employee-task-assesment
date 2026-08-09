/**
 * SearchBar Component
 *
 * A reusable search input.
 */

function SearchBar({

    value,

    onChange,

    placeholder

}) {

    return (

        <div className="row mb-4">

            <div className="col-md-4">

                <input

                    type="text"

                    className="form-control"

                    value={value}

                    onChange={(event) =>
                        onChange(event.target.value)
                    }

                    placeholder={placeholder}

                />

            </div>

        </div>

    );

}

export default SearchBar;