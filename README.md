# 301 redirect plan generator

This is a simple node script that attempts to most accurately match a list of old urls to a list of new urls. Include a `OLD_URL.csv` and `NEW_URL.csv` file in the root directory of this project. Run `node server` to generate a `301-redirect-plan.csv` file. Make sure to QA the results as there are often times multiple errors. Suggestions on how to make this more accurate are welcome.
