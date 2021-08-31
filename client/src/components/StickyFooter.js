import React from "react";
import { Container, Row, Col } from 'reactstrap'
import styles from './styles/StickyFooter.module.css'

const StickyFooter = props => (

    <footer>
        <Container fluid>
            <Row noGutters>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <div className={styles.footertext}>
                        A product of&nbsp;
                        <a href="https://www.highhelper.com"
                            target="_blank"
                            rel="noopener noreferrer">
                            High Helper LLC.
                        </a> |&nbsp;
                        <a href="https://www.highhelper.com/terms.html"
                            target="_blank"
                            rel="noopener noreferrer">
                            Terms of Use
                        </a> |&nbsp;
                        <a href="https://www.highhelper.com/privacy.html"
                            target="_blank"
                            rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    </footer>
)

export default StickyFooter


