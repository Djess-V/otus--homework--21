import React from "react";
import spongebob from "./images/spongebob.jpg";
import "./About.css";

const About = () => (
  <div className="_container">
    <div className="about">
      <div className="about__content content-about">
        <div className="content-about__header">
          <h2 className="content-about__header_title">About</h2>
        </div>
        <div className="content-about__body">
          <img src={spongebob} alt="SpongeBob" width="148px" height="180px" />
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>Cost management</td>
              </tr>
              <tr>
                <td>Author:</td>
                <td>Djess-V</td>
              </tr>
              <tr>
                <td>GitHub:</td>
                <td>
                  <a
                    className="github"
                    href="https://github.com/Djess-V/otus--homework--21"
                  >
                    https://github.com/Djess-V/otus--homework--21
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content-about__footer">
          <h3>Description</h3>
          <p>
            This application allows you to account for expenses by categories
            that you need to create beforehand. You can also view reports for
            the selected categories for a certain period of time.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
