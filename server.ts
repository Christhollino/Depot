import express from 'express';
import authRoutes from './routes/authRoutes';
import clientRoutes from "./routes/client/clientRoutes"

import chauffeurRoutes from "./routes/cooperative/chauffeurRoutes"
import voitureRoutes from "./routes/cooperative/voitureRoutes"
import reservationRoutes from "./routes/cooperative/reservationRoutes"
import voyageRoutes from "./routes/cooperative/voyageRoutes"



const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/client', clientRoutes);

app.use('/chauffeur', chauffeurRoutes);
app.use('/voiture', voitureRoutes);
app.use('/reservation', reservationRoutes);
app.use('/voyage', voyageRoutes);


export default app;
