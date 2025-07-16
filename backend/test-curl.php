<?php
$ch = curl_init("https://repo.packagist.org");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    echo "Success!";
}
curl_close($ch);