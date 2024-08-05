import * as Yup from "yup";

const AddFacilitySchema = Yup.object({
    facility: Yup.string()
        .required("Facility fields is required")
        .test('is-not-only-digits', 'Digits are not a valid facility', value => {
            return !/^[0-9]+$/.test(value);
        }),
    price: Yup.number()
        // .required("Price is required")
        .positive("Price must be a positive number")
        // .integer("Price must be an integer"),
});


export default AddFacilitySchema