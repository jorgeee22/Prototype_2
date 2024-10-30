require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuración de MongoDB
var user = process.env.DB_USER;
var password = process.env.DB_PASS;
var db = process.env.DB;

const mongoUrl = `mongodb+srv://${user}:${password}@cluster0.2f8ph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

  // Definir el esquema y el modelo
  

  const houseSchema = new mongoose.Schema({
      city: String,
      zipCode: String,
      price: Number,
      description: String,
      imageUrl: String,
      bedrooms: Number,
      bathrooms: Number,
      squareFeet: Number
  });
  
  const House = mongoose.model('House', houseSchema);
  module.exports = House;



  app.route('/search')
      .get((req, res) => {
        const address = req.query.address; 
        const Houses = [
          {
            "city": "Zapopan",
            "zipCode": "43221",
            "price": 245000,
            "name": "Modern Villa",
            "imageurl": "/pics/casa5.jpeg",
          },
          {
            "city": "Tlaquepaque",
            "zipCode": "43243",
            "price": 450500,
            "name": "Cozy Cottage",
            "imageurl": "/pics/casa4.jpeg",
          },
          {
            "city": "Tonala",
            "zipCode": "43256",
            "price": 434000,
            "name": "Urban Apartment",
            "imageurl": "/pics/casa3.jpeg",
          }
        ];
    
        let noHousesMessage = ''; // Inicializa el mensaje de no casas
    
        if (address) {
          // Filtrar las casas
          const filteredHouses = Houses.filter(house => 
            house.city.toLowerCase().includes(address.toLowerCase()) || 
            house.zipCode.includes(address) || 
            house.name.toLowerCase().includes(address.toLowerCase()) // Cambia description a name
          );
    
          // Verificar si no hay casas filtradas
          if (filteredHouses.length === 0) {
            noHousesMessage = 'No hay casas disponibles para la búsqueda realizada.';
          }
    
          res.render('page2', { Houses: filteredHouses, noHousesMessage,  address });
        } else {
          // Si no se ingresó ninguna dirección, se renderiza la página con todas las casas
          res.render('catalog', { Houses, noHousesMessage });
        }
      });
    
  
      

  app.get('/catalog', (req, res) => {
    // Datos de ejemplo de casas
    const Houses = [
      {
        "city": "Zapopan",
        "zipCode": "43221",
        "price": 245000,
        "name": "Modern Villa",
        "imageurl": "/pics/casa5.jpeg",
      },
      {
        "city": "Tlaquepaque",
        "zipCode": "43243",
        "price": 450500,
        "name": "Cozy Cottage",
        "imageurl": "/pics/casa4.jpeg",
      },
      {
        "city": "Tonala",
        "zipCode": "43256",
        "price": 434000,
        "name": "Urban Apartment",
        "imageurl": "/pics/casa3.jpeg",
      }
    ]
  
  res.render('catalog', { Houses });
});
    
      


// Ruta para mostrar la página de inicio después de autenticarse
app.get('/', (req, res) => {
    const data = {
        title: 'PRUEBA',
        message: 'ESTA NO ES VERSION FINAL, ES UNA PRUEBA',
        items: ['Elemento 1', 'Elemento 2', 'Elemento 3']
    };
    res.render('home', data); // Renderiza 'home.ejs' con los datos
});

// Rutas para el catálogo y los detalles de la casa
app.get('/house/:zipCode', (req, res) => {
  const zipCode = req.params.zipCode;
  
  const Houses = [
    {
      city: "Zapopan",
      zipCode: "43221",
      price: 245000,
      name: "Modern Villa",
      imageurl: "/pics/casa5.jpeg",
    },
    {
      city: "Tlaquepaque",
      zipCode: "43243",
      price: 450500,
      name: "Cozy Cottage",
      imageurl: "/pics/casa4.jpeg",
    },
    {
      city: "Tonala",
      zipCode: "43256",
      price: 434000,
      name: "Urban Apartment",
      imageurl: "/pics/casa3.jpeg",
    }
  ];

  // Encontrar la casa que coincide con el zipCode
  const house = Houses.find(house => house.zipCode === zipCode);

  if (house) {
    // Renderizar la vista de detalles con la información de la casa
    res.render('page3', { house });
  } else {
    res.status(404).send('Casa no encontrada');
  }
});


app.get('/services', (req, res) => {
    res.render('page4');
      });
      
 app.get('/sell', (req, res) => {
        res.render('sell');
          });
  
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});



// Ruta para mostrar el formulario de inicio de sesión
 //app.get('/', (req, res) => {
   // res.render('login'); // Renderiza el formulario de login en `login.ejs`
//});

// Ruta para manejar la autenticación (POST) - Ahora acepta cualquier email y contraseña
//app.post('/login', (req, res) => {
  //  const { email, password } = req.body;

    // No se valida el email y la contraseña, simplemente redirige al usuario a la página de inicio
 //   res.redirect('/home'); // Redirige a la página de inicio (`home.ejs`)
//});