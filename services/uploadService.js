const ftp = require("basic-ftp");

const uploadToFTP = async (fileBuffer, fileName) => {
    const client = new ftp.Client();

    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: process.env.FTP_PORT || 21,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false
        });
        await client.ensureDir(process.env.FTP_UPLOAD_DIR);
        await client.uploadFrom(Buffer.from(fileBuffer), `${process.env.FTP_UPLOAD_DIR}/${fileName}`);

        // devuelve la URL de acceso a la imagen
        return `${process.env.FTP_BASE_URL}/${fileName}`;
    } catch (err) {
        throw new Error('Error subiendo a FTP: ' + err.message);
    } finally {
        client.close();
    }
};

module.exports = uploadToFTP;
