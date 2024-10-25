import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import nodemailer from "nodemailer";

dotenv.config();


const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
let REFRESH_TOKEN = "";
let ACCESS_TOKEN = "";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async () => {
    try {


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'certificate.mos@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN,
            },
        });

        const receivers = [
            'lauranuraini@unisba.ac.id',
            'aprimawidya@unisba.ac.id',
            'randytaruna21@gmail.com',
            'melvindarmawan@unisba.ac.id',
            'freyanadhira@unisba.ac.id',
            'rania1313@gmail.com',
            'zalfaamira@unisba.ac.id',
            'antikanur11@gmail.com',
            'haristramadhan06@unisba.ac.id',
            'nayladwisaf5@unisba.ac.id',
            'nandhiNugro@unsoed.ac.id',
            'harphendieko22@unsoed.ac.id'
        ]

        let results = [];

        for (const receiver of receivers) {
            const mailOptions = {
                from: 'certificate.mos@gmail.com',
                to: receiver,
                subject: 'Pemberitahuan Penting Terkait Formulir Uji Kompetensi MOS',
                html: `<p>Halo ${receiver},</p>
                    <p>
                        Terima kasih atas partisipasi Anda dalam mengisi formulir yang 
                        telah kami bagikan terkait uji kompetensi Microsoft Office Specialist 
                        (MOS).
                    </p>
                    
                    <p>
                        Kami ingin memberitahukan bahwa formulir yang Anda isi merupakan bagian 
                        dari eksperimen social engineering yang bertujuan untuk mengukur kewaspadaan 
                        terhadap keamanan data pribadi. Tidak ada uji kompetensi MOS yang akan 
                        dilaksanakan berdasarkan formulir ini.
                    </p>
                    
                    <p>
                        Tujuan utama eksperimen ini adalah untuk mengedukasi pentingnya menjaga 
                        kerahasiaan data pribadi di era digital, terutama ketika memberikan 
                        informasi sensitif secara online.
                    </p>

                    <p><strong>Mengapa Hal Ini Penting?</strong></p>

                    <ul>
                        <li>
                            <strong>Data Pribadi Berharga:</strong> Informasi seperti nama, tanggal lahir, email, dan nomor 
                            telepon adalah data yang sangat penting dan dapat digunakan oleh pihak yang tidak 
                            bertanggung jawab untuk tujuan yang merugikan.
                        </li>

                        <li>
                            <strong>Selalu Periksa Kredibilitas:</strong> Sebelum mengisi formulir atau memberikan informasi 
                            pribadi secara online, pastikan sumbernya berasal dari lembaga yang dapat dipercaya. 
                            Cek kredibilitas website, organisasi, dan baca syarat ketentuan dengan seksama.
                        </li>

                        <li>
                            <strong>Waspada Terhadap Penipuan Online:</strong> Penipuan sering kali berbentuk seperti tawaran 
                            menarik yang mengharuskan Anda memberikan informasi pribadi. Jangan mudah tergiur 
                            dengan janji-janji seperti "gratis" atau "instan" tanpa memverifikasi kebenarannya.
                        </li>
                    </ul>

                    <p><strong>Apa yang Akan Kami Lakukan dengan Data Anda?</strong></p>

                    <p>
                        Kami ingin meyakinkan Anda bahwa data yang telah Anda 
                        berikan tidak akan disalahgunakan. Data ini hanya digunakan 
                        untuk keperluan analisis eksperimen, dan kami akan menghapus 
                        semua data segera setelah eksperimen ini selesai.
                    </p>
                    
                    <p>
                        Kami mohon maaf apabila eksperimen ini menyebabkan ketidaknyamanan. 
                        Tujuan kami adalah untuk membantu Anda lebih waspada dalam menjaga 
                        keamanan informasi pribadi di internet.
                    </p>

                    <p>
                        Terima kasih atas perhatian dan partisipasi Anda.
                    </p>
                    `,
            };

            const result = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${receiver}:`, result);
            results.push(result);
        }

        return results;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

app.get('/auth', (req, res) => {
    const scopes = [
        'https://mail.google.com/',
    ];

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    res.redirect(authUrl);
});


app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.send('Authorization code not found');
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        REFRESH_TOKEN = tokens.refresh_token;
        ACCESS_TOKEN = tokens.access_token;

        console.log('Access Token:', ACCESS_TOKEN);
        console.log('Refresh Token:', REFRESH_TOKEN);
        res.send('Authorization successful. Check your console for refresh token.');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.send('Error during authorization');
    }
});

app.get('/sendmail', async (req, res) => {
    try {
        const sendMail = await sendEmail();

        res.status(200).json({
            status: 200,
            message: "OK",
            data: sendMail
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            message: "error",
            error: error
        });
    }

});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
