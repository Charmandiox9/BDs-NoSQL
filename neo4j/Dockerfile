# Dockerfile para la aplicación de seeding
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY seed-database.js ./

# Comando por defecto
CMD ["node", "seed-database.js"]