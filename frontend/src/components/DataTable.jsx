/**
 * DataTable Component
 *
 * Generic reusable table component.
 */

function DataTable({

    columns,

    data,

    renderActions

}) {

    return (

        <div className="table-responsive">

            <table className="table table-hover align-middle">

                <thead
                    style={{
                        backgroundColor: "#EEF4FF"
                    }}
                >

                    <tr>

                        {

                            columns.map(column => (

                                <th key={column.key}>

                                    {column.label}

                                </th>

                            ))

                        }

                        {

                            renderActions &&
                            <th className="text-center">

                                Actions

                            </th>

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        data.map(row => (

                            <tr key={row.id}>

                                {

                                    columns.map(column => (

                                        <td key={column.key}>

                                            {column.render
                                                ? column.render(row)
                                                : row[column.key]}

                                        </td>

                                    ))

                                }

                                {

                                    renderActions &&

                                    <td className="text-center">

                                        {renderActions(row)}

                                    </td>

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default DataTable;