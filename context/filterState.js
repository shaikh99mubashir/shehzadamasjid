import React, { useState } from "react"
import filterContext from "./filterContext"


const FilterState = (prop) => {

    const [category, setCategory] = useState("")
    const [subjects, setSubjects] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")


    return (
        <filterContext.Provider value={{ category, setCategory, subjects, setSubjects, state, setState, city, setCity }} >
            {prop.children}
        </filterContext.Provider>
    )

}

export default FilterState