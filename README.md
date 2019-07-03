<h1 align="center">
<img alt="pdf-lib" height="300" src="https://raw.githubusercontent.com/Hopding/pdf-lib-docs/master/assets/logo-full.svg?sanitize=true">
</h1>

<div align="center">
  <strong>Create and modify PDF documents in any JavaScript environment.</strong>
</div>
<div align="center">
  Designed to work in any modern JavaScript runtime. Tested in Node, Browser, and React Native environments.
</div>

<br />

<div align="center">
  <!-- NPM Version -->
  <a href="https://www.npmjs.com/package/pdf-lib">
    <img
      src="https://img.shields.io/npm/v/pdf-lib.svg?style=flat-square"
      alt="NPM Version"
    />
  </a>
  <!-- Build Status -->
  <a href="https://circleci.com/gh/Hopding/pdf-lib">
    <img
      src="https://img.shields.io/circleci/project/github/Hopding/pdf-lib/master.svg?style=flat-square&label=CircleCI"
      alt="CircleCI Build Status"
    />
  </a>
  <!-- Prettier Badge -->
  <a href="https://prettier.io/">
    <img
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      alt="Prettier Badge"
    />
  </a>
</div>

## Table of Contents

- [Features](#features)
- [Motivation](#motivation)
- [Examples](#examples)
  - [Document Creation](#document-creation)
  - [Document Modification](#document-modification)
  - [Copying Pages](#copying-pages)
  - [Embed Font and Measure Text](#embed-font-and-measure-text)
- [Installation](#installation)
- [Prior Art](#prior-art)
- [License](#license)

## Features

- Create new PDFs
- Modify existing PDFs
- Add Pages
- Insert Pages
- Remove Pages
- Copy pages between PDFs
- Draw Text
- Draw Images
- Draw Vector Graphics
- Embed Fonts (supports UTF-8 and UTF-16 character sets)
- Measure width and height of text
- Embed Images

## Motivation

`pdf-lib` was created to address the JavaScript ecosystem's lack of robust support for PDF manipulation (especially for PDF _modification_).

Two of `pdf-lib`'s distinguishing features are:

1. Supporting modification (editing) of existing documents.
2. Working in all JavaScript environments - not just in Node or the Browser.

There are [other](#prior-art) good open source JavaScript PDF libraries available. However, most of them can only _create_ documents, they cannot _modify_ existing ones. And many of them only work in particular environments.

## Examples

### Document Creation

```js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const pdfDoc = await PDFDocument.create();

const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

const page = pdfDoc.addPage();

page.drawText('Creating PDFs in JavaScript is awesome!', {
  x: 50,
  y: 450,
  size: 15,
  font: timesRomanFont,
  color: rgb(0, 0.53, 0.71),
});

const pdfBytes = await pdfDoc.save();
```

### Document Modification

```js
import { PDFDocument, rgb } from 'pdf-lib';

// This should be a Uint8Array.
// This data can be obtained in a number of different ways.
// If your running in a Node environment, you could use fs.readFile().
// In the browser, you could make a fetch() call and use res.arrayBuffer().
const existingPdfBytes = ...

const pdfDoc = await PDFDocument.load(existingPdfBytes)

const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

const pages = pdfDoc.getPages()
const firstPage = pages[0]

firstPage.drawText('This text was added to the PDF with JavaScript!', {
  x: 25,
  y: 25,
  size: 24,
  font: helveticaFont,
  color: rgb(0.95, 0.26, 0.21),
})

const pdfBytes = await pdfDoc.save()
```

### Copying Pages

```js
import { PDFDocument } from 'pdf-lib'

const pdfDoc = await PDFDocumentFactory.create();

// These should be a Uint8Arrays. (see Document Modification example for more details)
const firstDonorPdfBytes = ...
const secondDonorPdfBytes = ...

const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes)
const secondDonorPdfDoc = await PDFDocument.load(secondDonorPdfBytes)

// We'll copy the fourth page from the first donor document, and the
// first page from the second donor document.
const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [3])
const [secondDonorPage] = await pdfDoc.copyPages(secondDonorPdfDoc, [0])

// Copy over the pages from the donor documents into our new document
pdfDoc.addPage(firstDonorPage)
pdfDoc.insertPage(0, secondDonorPage)

const pdfBytes = await pdfDoc.save()
```

### Embed Font and Measure Text

```js
import { PDFDocument, rgb } from 'pdf-lib'

// This should be a Uint8Array.
// This data can be obtained in a number of different ways.
// If your running in a Node environment, you could use fs.readFile().
// In the browser, you could make a fetch() call and use res.arrayBuffer().
const fontBytes = ...

const pdfDoc = await PDFDocument.create()

const embeddedFont = await pdfDoc.embedFont(fontBytes)

const page = pdfDoc.addPage()

const text = 'This is text in an embedded font!'
const textSize = 15
const textWidth = embeddedFont.widthOfTextAtSize(text, textSize)
const textHeight = embeddedFont.heightAtSize(textSize)

// Draw text on page
page.drawText(text, {
  x: 50,
  y: 450,
  size: textSize,
  font: embeddedFont,
  color: rgb(0, 0.53, 0.71),
})

// Draw a box around the text
page.drawRectangle({
  x: 50,
  y: 450,
  width: textWidth,
  height: textHeight,
  borderColor: rgb(1, 0, 0),
  borderWidth: 0.5,
})

const pdfBytes = await pdfDoc.save()
```

## Installation

### NPM Module

To install the latest stable version:

```bash
# With npm
npm install --save pdf-lib

# With yarn
yarn add pdf-lib
```

This assumes you're using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/) as your package manager.

### UMD Module

You can also download `pdf-lib` as a UMD module from [unpkg](https://unpkg.com/#/). The UMD builds have been compiled to ES5, so they should work [in any modern browser](https://caniuse.com/#feat=es5). UMD builds are useful if you aren't using a package manager or module bundler. For example, you can use them directly in the `<script>` tag of an HTML page.

The following builds are available:

- https://unpkg.com/pdf-lib/dist/pdf-lib.js
- https://unpkg.com/pdf-lib/dist/pdf-lib.min.js

When using a UMD build, you will have access to a global `window.PDFLib` variable. This variable contains all of the classes and functions exported by `pdf-lib`. For example:

```javascript
// NPM module
import { PDFDocument, rgb } from 'pdf-lib';

// UMD module
var PDFDocument = PDFLib.PDFDocument;
var rgb = PDFLib.rgb;
```

## Prior Art

- [`pdfkit`](https://github.com/devongovett/pdfkit) is a PDF generation library for Node and the Browser. This library was immensely helpful as a reference and existence proof when creating `pdf-lib`. `pdfkit`'s code for [font embedding](https://github.com/Hopding/pdf-lib/blob/AddDocumentation/src/core/pdf-structures/factories/PDFFontFactory.ts#L64-L68), [PNG embedding](https://github.com/Hopding/pdf-lib/blob/AddDocumentation/src/core/pdf-structures/factories/PNGXObjectFactory.ts#L19-L23), and [JPG embedding](https://github.com/Hopding/pdf-lib/blob/AddDocumentation/src/core/pdf-structures/factories/JPEGXObjectFactory.ts#L32-L36) was especially useful.
- [`pdf.js`](https://github.com/mozilla/pdf.js) is a PDF rendering library for the Browser. This library was helpful as a reference when writing `pdf-lib`'s parser. Some of the code for stream decoding was ported directly to TypeScript for use in `pdf-lib`.
- [`jspdf`](https://github.com/MrRio/jsPDF) is a PDF generation library for the browser.
- [`pdfmake`](https://github.com/bpampuch/pdfmake) is a PDF generation library for the browser.
- [`hummus`](https://github.com/galkahana/HummusJS) is a PDF generation and modification library for Node environments. `hummus` is a Node wrapper around a [C++ library](https://github.com/galkahana/PDF-Writer), so it doesn't work in many JavaScript environments - like the Browser or React Native.
- [`react-native-pdf-lib`](https://github.com/Hopding/react-native-pdf-lib) is a PDF generation and modification library for React Native environments. `react-native-pdf-lib` is a wrapper around [C++](https://github.com/galkahana/PDF-Writer) and [Java](https://github.com/TomRoush/PdfBox-Android) libraries.
- [`pdfassembler`](https://github.com/DevelopingMagic/pdfassembler) is a PDF generation and modification library for Node and the browser. It requires some knowledge about the logical structure of PDF documents to use.

## License
