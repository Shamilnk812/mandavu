#  Mandavu - Convention Center Booking Website


Mandavu is a powerful and user-friendly web application designed to streamline the process of booking convention centers. Whether it's for weddings, corporate events, exhibitions, or other gatherings, Mandavu provides a seamless experience for both venue owners and customers. It provides secure authentication, real-time communication, payment processing, and more.


## Features

### For Users

- **Secure Authentication**: Users can easily create accounts with OTP verification.
- **Easy Browsing**: Search and filter convention centers based on location, capacity, and price range.
- **Real-Time Communication**: Users can engage in real-time chats with venue owners to make inquiries.
- **Interactive Map Integration**: View venue locations on a map and navigate via Google Maps.
- **Instant Booking**: Real-time availability checks and immediate booking confirmations.
- **Secure Payments**: Secure payment options with refund capabilities and secure processing.
- **User Reviews**: Read and write reviews to share experiences.


### For Venue Owners

- **Booking Management**: Easily manage booking details with advanced search options to keep track of reservations.
- **Event Management**: Add and manage events seamlessly, ensuring all details are organized.
- **Facility Management**: Add and update facility details, including additional amenities, to attract more clients.
- **Booking Packages**: Create and customize booking packages tailored for special events to offer attractive deals.
- **Maintenance System**: Set up maintenance schedules to ensure the venue remains in top condition.
- **Direct Communication**: Engage in real-time chats with potential clients to answer queries promptly.
- **Analytics Dashboard**: View sales data weekly, monthly, and yearly to monitor performance and make informed decisions.



### For Admin

- **User Management**: View and manage all users, ensuring a smooth operation of the platform.
- **Venue Management**: Validate or reject venue listings and oversee venue-related activities.
- **Analytics Dashboard**: View sales analytics on a weekly, monthly, and yearly basis.





## Technology Stack

- **Backend**: Python and Django
- **Frontend**: React
- **Database**: PostgreSQL
- **Real-Time Communication**: Django Channels and WebSockets
- **Cross-Origin Resource Sharing (CORS)**: Configured to allow secure cross-origin requests


## Key Libraries & Integrations

- **Python & Django**: Serve as the backend framework, providing robust tools for building secure and scalable web applications.
- **React**: Handles the frontend development, enabling the creation of dynamic and responsive user interfaces.
- **Django REST Framework (DRF)**: Facilitates the creation of RESTful APIs, allowing seamless communication between the frontend and backend.
- **PostgreSQL**: Utilized as the primary database system, offering reliable and efficient data storage solutions.
- **JSON Web Tokens (JWT)**: Employed for secure authentication mechanisms, ensuring safe and stateless user sessions.
- **Django Channels & WebSockets**: Enable real-time communication features, such as live chats and instant notifications.
- **OpenCage Geocoding**: Provides geocoding services to convert addresses into geographic coordinates, enhancing location-based functionalities.
- **Stripe**: Integrates secure payment processing capabilities, supporting various payment methods and ensuring compliance with financial regulations.
- **CORS (Cross-Origin Resource Sharing)**: Configured to allow secure cross-origin requests, enabling the frontend and backend to interact seamlessly despite being hosted on different domains.


## 🛠️ Project Setup

### Clone the repository

```bash
https://github.com/Shamilnk812/mandavu.git
```

### Navigate to the frontend directory

```bash
cd frontend
```

### Install the dependencies

```bash
npm install
```

### Run the developement server

```bash
npm run dev
```

### Navigate to the backend directory

```bash
cd backend/mandavu
```

### Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate #linux
venv/scripts/activate  # windows
```

### Install the dependencies

```bash
pip install -r requirements.txt
```

### Create a .env file in the root directory and add your environment variables

```bash
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
BASE_FRONT_END_URL=frontendurl

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_USE_TLS=True
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=email_port
EMAIL_HOST_USER=dummyemail@example.com
EMAIL_HOST_PASSWORD=dummypassword123

DB_NAME=kickoff_saga_db
DB_USER=kickoff_saga_user
DB_PASSWORD=strong_dummy_password
DB_HOST=localhost
DB_PORT=port

STRIPE_SECRET_KEY=your_stripe_secreat_key
STRIPE_SECRET_WEBHOOK=your_stripe_webhook_key
```

### Apply migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Run the development server using Daphne

```bash
daphne mandavu.asgi:application

```


