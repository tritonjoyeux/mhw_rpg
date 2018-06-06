<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mhw RPG</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
          integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossorigin="anonymous"></script>
</head>
<body>
<?php
session_start();

if (isset($_POST["login"]) && isset($_POST["password"])) {
    $_SESSION["login"] = ($_POST["login"] == "admin" && $_POST["password"] == "modif");
}
if ($_SESSION['login'] === true) {
    if (isset($_POST["update"])) {
        file_put_contents("./bodys.json", $_POST["bodys"]);
        file_put_contents("./heads.json", $_POST["heads"]);
        file_put_contents("./gloves.json", $_POST["gloves"]);
        file_put_contents("./waists.json", $_POST["waists"]);
        file_put_contents("./legs.json", $_POST["legs"]);
        file_put_contents("./levels.json", $_POST["levels"]);
        file_put_contents("./monsters.json", $_POST["monsters"]);
        file_put_contents("./rewards.json", $_POST["rewards"]);
        file_put_contents("./rewards.txt", $_POST["rewardsT"]);
        file_put_contents("./rings.txt", $_POST["rings"]);
        file_put_contents("./weapons.txt", $_POST["weapons"]);
    }
    $bodys = file_get_contents("./bodys.json");
    $heads = file_get_contents("./heads.json");
    $gloves = file_get_contents("./gloves.json");
    $waists = file_get_contents("./waists.json");
    $legs = file_get_contents("./legs.json");
    $levels = file_get_contents("./levels.json");
    $monsters = file_get_contents("./monsters.json");
    $rewards = file_get_contents("./rewards.json");
    $rewardsT = file_get_contents("./rewards.txt");
    $rings = file_get_contents("./rings.txt");
    $weapons = file_get_contents("./weapons.txt");
    ?>
    <div class="container" style="text-align: center">
        <h1>Data</h1>
        <form action="/" method="post">
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="bodys">Torses</label>
                <textarea name="bodys" id="bodys" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $bodys ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="gloves">Bras</label>
                <textarea name="gloves" id="gloves" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $gloves ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="waists">Tassettes</label>
                <textarea name="waists" id="waists" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $waists ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
            <div class="col-sm-3">
                <label for="heads">Têtes</label>
                <textarea name="heads" id="heads" class="form-control" style="min-width: 100%; max-width: 100%; min-height: 300px; max-height: 300px;"><?php echo $heads ?></textarea>
            </div>
        </form>
    </div>
    <?php
} else {
    ?>
    <div>
        <form action="/" method="post">
            <input type="text" name="login" placeholder="login"><br>
            <input type="password" name="password" placeholder="password">
            <input type="submit" value="Login">
        </form>
    </div>
    <?php
}
?>
</body>
</html>