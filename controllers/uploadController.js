const FTPClient = require("ftp");
const fs = require("fs");

const uploadToFTP = (filePath, remotePath) => {
    return new Promise((resolve, reject) => {
        const client = new FTPClient();

        client.on("ready", () => {
            const dirPath = remotePath.substring(0, remotePath.lastIndexOf('/'));  // Directorio destino en el FTP

            // Verificar si el directorio existe en el servidor FTP, si no lo crea
            client.mkdir(dirPath, true, (err) => {
                if (err) {
                    return reject(err); // Error al crear directorio
                }

                // Subir archivo
                client.put(filePath, remotePath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("Archivo subido exitosamente.");
                    }
                    client.end();
                });
            });
        });

        client.on("error", (err) => {
            reject(err);
        });

        client.connect({
            host: "ftp.neumaticor.com.ar",
            user: "u117252722.neumaticor.com.ar",
            password: "~Is2JoT|J>V2Ir[I",
        });
    });
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha enviado ningún archivo." });
        }

        const directory = req.body.directory;
        if (!directory) {
            return res.status(400).json({ error: "El nombre del directorio es obligatorio." });
        }

        const localPath = req.file.path;
        const remotePath = `/public_html/uploads/${directory}/${req.file.originalname}`;

        console.log("Subiendo archivo...");
        const result = await uploadToFTP(localPath, remotePath);

        // Eliminar archivo local solo si la carga fue exitosa
        fs.unlinkSync(localPath);

        res.status(200).json({ message: result, path: remotePath });
    } catch (error) {
        console.error("Error en la subida de imagen:", error);
        res.status(500).json({ error: "Error al subir la imagen." });
    }
};
