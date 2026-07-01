This folder is an example for server-side protected portfolio content.

Do not place the real protected files in `src/assets`.
Do not import them into Angular.

Expected real deployment structure:

- `protected-portfolio-content/ynspool/screens/...`
- `protected-portfolio-content/ynspool/snippets/...`

The real `protected-portfolio-content/` folder is ignored via `.gitignore`.
For local testing or deployment, place it next to:

- `protectedPortfolio.php`
- `protectedPortfolioAsset.php`
- `protectedPortfolio.config.php`

If this folder must live inside `public_html`, also add the contents of
`.htaccess.example` as `.htaccess` inside the real `protected-portfolio-content/`
folder to block direct browser access.
