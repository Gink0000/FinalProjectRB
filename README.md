  # FinalProjectRB
  
The app marks locations around the world that do not get the traction they should when it comes to tourists, and allows users to show off these hidden spots so others can travel there
  
POST /api/auth/signup - register user
POST /api/auth/login - login user
POST /api/auth/logout -logout
GET /api/auth/me -get usre info
GET /locations - get all approved locations
GET /locations/pending/all - get all pending locations(admin only)
GET /Locations/:id - get location details by ID
POST /locations - add a new location (requires authentication)
PATCH /locations/:id/approve - approve a location(admin only)
DELETE /locations/:id/reject - reject/delete a location(admin only)
DELETE /locations/:id - delete a location(admin only)

External Api
Google Maps Embed API for showing google maps to users and admins a like



Frontend: fntend-oe5ffji44-ginkos-projects-5b807f85.vercel.app
Backend: https://finalprojectrb.onrender.com or https://dashboard.render.com/web/srv-d26o41uuk2gs73c6hkcg/deploys/dep-d26o42euk2gs73c6hla0?r=2025-08-02%4003%3A11%3A09~2025-08-02%4003%3A14%3A31

I could not get the frontend and backend to work together  after deploying i tried to change the all refrences to local host but ran into a lot of issues because I think i setup the backend poorly and could not figure it out 

Credit
Mongodb
googlemaps
bootstrap 

C
