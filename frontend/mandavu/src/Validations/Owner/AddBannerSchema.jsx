import * as Yup from 'yup';

const AddBannerSchema = Yup.object({
    venue_photo: Yup.mixed().required('An image is required'),
})


export default AddBannerSchema