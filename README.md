This workflow utilizes the [Ink Resposnive Email Framework](http://zurb.com/ink/) by Zurb. It uses a [Sass Port of the framework](https://github.com/faustgertz/sassy-ink) which allows you to customize the framework.

## Getting Started

```
npm install && bower install
```

`grunt server` for dev
`grunt compile` for production
`grunt compile:mailchimp` to use MailChimp-specific layouts, partials, and data.

## Testing

You can test your email by running `grunt test:mailgun` or `grunt test:litmus`. Make sure you rename `mail.config.example.js` to `mail.config.js` and enter in all the needed info.