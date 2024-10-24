import * as Yup from "yup";


const BookingPackagesShcema =  Yup.object().shape({
    package_name: Yup.string()
      .required("Package name is required")
      .matches(/^[a-zA-Z0-9\s]+$/, "Package name must contain only alphanumeric characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    price_for_per_hour: Yup.mixed()
      .test(
        "is-valid-price",
        "Must be a positive integer or 'Not Allowed'",
        (value) => value === "Not Allowed" || (Number.isInteger(+value) && +value > 0)
      )
      .required("Price per hour is required"),
    // description: Yup.string()
    //   .required('Description is required'),

    air_condition: Yup.string().required("Please select an option for air conditioning"),
    extra_price_for_aircondition: Yup.number()
      .nullable()
      .when("air_condition", {
        is: "AC",
        then: (schema) =>
          schema
            .required("Extra price for AC is required")
            .positive("Extra price must be a positive number"),
        otherwise: (schema) => schema.nullable() // Make this field nullable when it's not required
      })
  });


export default BookingPackagesShcema;