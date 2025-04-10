import * as Yup from 'yup';

const MaintenanceValidationSchema = Yup.object().shape({
  start_date: Yup.date()
    .required('Start date is required')
    .test('is-valid-start-date', 'Enter a valid start date', function (value) {
      const { end_date } = this.parent;
      return !end_date || new Date(value) <= new Date(end_date);
    }),
  end_date: Yup.date()
    .required('End date is required')
    .test('is-valid-end-date', 'Enter a valid end date', function (value) {
      const { start_date } = this.parent;
      return !start_date || new Date(value) >= new Date(start_date);
    }),
  reason: Yup.string()
  .required('Maintenance reason is required')
  .trim()
  .min(10, 'Reason must be at least 10 characters')
  .max(300, 'Reason cannot exceed 300 characters')
  .matches(
    /^[a-zA-Z0-9\s.,'"()-]*$/,
    'Reason can only contain letters, numbers, spaces, and common punctuation'
  ),
});

export default MaintenanceValidationSchema;
