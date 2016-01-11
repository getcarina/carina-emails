# carina-emails
Email templates with Carina look-and-feel

## Usage

1. Create a new HTML file in `templates`. This is a Nunjucks template, and can extend other templates within that directory. Almost every template you make should extend `layouts/_main.html` and place its own content in the `body` block.
1. Run `gulp build -t templates/your-template.html`. Gulp will compile `scss/main.scss`, render the template `templates/your-template.html`, inline the CSS so it appears correctly in email clients, and save the result to `build/your-template.html`.

## Testing templates

Sometimes the quickest way to test a template is just to send it to yourself.

1. Export the environment variables `MG_DOMAIN` and `MG_APIKEY` using the Mailgun API Key and domain of your choice.
1. Run `gulp mail --file build/your-template.html --to you@example.com` to send that fully-built HTML file to the desired email address.

## Resources

The SCSS includes [Zurb Foundation for Emails](http://foundation.zurb.com/emails/docs.html) to help get you started, but you can add whatever you want to the SCSS project.
