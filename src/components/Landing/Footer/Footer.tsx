import React from 'react';
import styles from "./Footer.module.scss"
import LanguageSelect from "./LanguageSelect";
import SocialMedia from "./SocialMedia";

const Footer = ({open} : {open: () => void}) => {
    return (
        <div className={styles.footer}>
            <div className={styles.row}>
                <div className={styles.imaginePlace}>
                    <h1>Imagine a place</h1>
                    <LanguageSelect/>
                    <SocialMedia/>
                </div>
                <table>
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Company</th>
                        <th>Resources</th>
                        <th>Policies</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><a>Download</a></td>
                        <td><a>About</a></td>
                        <td><a>Support</a></td>
                        <td><a>Privacy</a></td>
                    </tr>
                    <tr>
                        <td/>
                        <td/>
                        <td><a>Blog</a></td>
                        <td/>
                    </tr>
                    <tr>
                        <td/>
                        <td/>
                        <td><a>Feedback</a></td>
                        <td/>
                    </tr>
                    <tr>
                        <td/>
                        <td/>
                        <td><a>Creators</a></td>
                        <td/>
                    </tr>
                    <tr>
                        <td/>
                        <td/>
                        <td><a>Community</a></td>
                        <td/>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.button} onClick={open}>Sign up</div>
        </div>
    );
};

export default Footer;