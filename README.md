# Clone multiple repositories

## Instructions:

1. Run `npm install` or `yarn`.

2. Add an array of repository links (ssh connection) to the file `repositories.json`.

```json
// repositories.json
[
    "git@github.com:user-name/repo-name-01.git",
    "git@github.com:user-name/repo-name-02.git"
]
```

3. Run `npm run start` or `yarn start`.

4. Create a folder name

```
Enter folder name: folder-name
```

5. You can set a date to filter commits.

```
Do you want to enter a date to filter the commits? [y/n]: y
```

```
Enter limit day (ex.: 03): 20
```

```
Enter limit month (ex.: 08): 03
```

```
Enter limit Year (ex.: 2020): 2021
```

-   If you enter the date, it will clone the repositories and checkout to the last commit before the date.

### Output

```
Finished
2 repositories cloned in folder: /path/to/the/folder
Failed: 0 repository
```
