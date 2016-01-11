# carina-emails
Email templates with Carina look-and-feel

## Usage

1. Create a new HTML file in `templates`. This is a Nunjucks template, and can extend other templates within that directory. Almost every template you make should extend `layouts/_main.html` and place its own content in the `body` block.
1. Run `gulp build -t templates/your-template.html`. Gulp will compile `scss/main.scss`, render the template `templates/your-template.html`, inline the CSS so it appears correctly in email clients, and save the result to `build/your-template.html`.

## Resources

The SCSS includes [Zurb Foundation for Emails](http://foundation.zurb.com/emails/docs.html) to help get you started, but you can add whatever you want to the SCSS project.
