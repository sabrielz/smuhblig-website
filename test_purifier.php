<?php
require __DIR__.'/vendor/autoload.php';

echo class_exists('HTMLPurifier_Config') ? 'OK' : 'FAIL';
