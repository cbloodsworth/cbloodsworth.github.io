import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const latexFilePath = path.resolve(__dirname, '../content/assets/pdf/cbloodsworth_resume.tex');
const htmlPath = path.resolve(__dirname, '../content/resume.njk');

try {
    console.log(`Converting ${latexFilePath} to ${htmlPath}...`);
    execSync(`pandoc "${latexFilePath}" -o "${htmlPath}"`);
    console.log('Resume conversion successful');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Add header
    htmlContent = `---js
const eleventyNavigation = {
    key: "Resume",
    order: 5
};
---
<a href="/assets/pdf/cbloodsworth_resume.pdf"><div style="margin-bottom: 0.25em">(pdf version)</div><br /></a>
` + htmlContent;

    // Styling for the list and tables...
    htmlContent = htmlContent.replaceAll('<li><table>', 
        `<li style="list-style-type: none; margin-left: -2em; width: 120%;">
        <table style="width: 100%; margin-bottom: 0em;">`
    );

    // Slight styling for the headers
    htmlContent = htmlContent.replaceAll('<h1 ', 
        '<h1 style="margin-bottom: 0.5em;" ')

    htmlContent = htmlContent.replace(/<p><strong><span class="smallcaps">Christopher\s*Bloodsworth<\/span><\/strong><br \/>/,
        '<h1>Christopher Bloodsworth</h1><p>'
    )

    // Replace email with `mailto:` link
    htmlContent = htmlContent.replace('href="christopherbloodsworth@gmail.com"',
        'href="mailto:christopherbloodsworth@gmail.com" target="_blank" rel=noopener'
    );

    // LinkedIn
    // note we match on the <u> so we don't pick up the href. This may break in the future...
    htmlContent = htmlContent.replace('<u>linkedin.com/in/chris-bloodsworth',
        '<u>LinkedIn'
    );

    // GitHub
    htmlContent = htmlContent.replace('<u>github.com/cbloodsworth',
        '<u>GitHub'
    );

    // Delete the link to the personal website... we're already there.
    htmlContent = htmlContent.replace(/<span>Personal Website.*?<\/p>/s, '</p>');

    fs.writeFileSync(htmlPath, htmlContent)


} catch (error) {
    console.error('Error converting resume:', error);
}