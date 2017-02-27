<?php

    require 'hueproxysettings.php';

    $debug = ($_GET['debug'] === "1");
    
    if($debug)
    {
	    echo("--Debugging Enabled <br />");
    }
    

    
    /**
     * Setting up crap
    */
    
    //This crap was already here
    if (!function_exists('getallheaders')) 
    { 
        function getallheaders() 
        { 
            $headers = ''; 
           foreach ($_SERVER as $name => $value) 
           { 
               if (substr($name, 0, 5) == 'HTTP_') 
               { 
                   $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value; 
               } 
           } 
           return $headers; 
        } 
    } 

    //Shit I made
    
    /**
    * Check if a client IP is in our Server subnet
    *
    * @param string $client_ip
    * @param string $server_ip
    * @return boolean
    */
    function clientInSameSubnet($client_ip=false,$server_ip=false) {
        if (!$client_ip)
            $client_ip = $_SERVER['REMOTE_ADDR'];
        if (!$server_ip)
            $server_ip = $_SERVER['SERVER_ADDR'];
        // Extract broadcast and netmask from ifconfig
        if (!($p = popen("ifconfig","r"))) return false;
        $out = "";
        while(!feof($p))
            $out .= fread($p,1024);
        fclose($p);
        // This is because the php.net comment function does not
        // allow long lines.
        $match  = "/^.*".$server_ip;
        $match .= ".*Bcast:(\d{1,3}\.\d{1,3}i\.\d{1,3}\.\d{1,3}).*";
        $match .= "Mask:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/im";
        if (!preg_match($match,$out,$regs))
            return false;
        $bcast = ip2long($regs[1]);
        $smask = ip2long($regs[2]);
        $ipadr = ip2long($client_ip);
        $nmask = $bcast & $smask;
        return (($ipadr & $smask) == ($nmask & $smask));
    }

    function config(){
        
        /**
        * [Request To Be Proxied]
        *      (normal shit)               //REMOTE_ADDR
        *          <->
        *      (myExternalAddress)         //HOST
        * [Proxy]
        *      (myAddressRelativeToProxy) //HOST if external target, SERVER_ADDR if internal 
        *          <-> 
        *      (targetAddress)             //Configured
        * [Target Address]
        */
        
        global $debug;
        global $requesterAddress;
        global $myAddressRelativeToProxy;
        global $myAddressRelativeToRequester;
        global $targetAddress;
        
        $requesterAddress                   = $_SERVER['HTTP_X_FORWARDED_FOR'];
        $myAddressRelativeToRequester       = $_SERVER["HTTP_HOST"];
        //$myAddressRelativeToRequester        = '73.2.125.174';       
        
        $remoteTarget  = !clientInSameSubnet($targetAddress);
        $remoteRequest = !clientInSameSubnet($requesterAddress);

        if($remoteProxy === TRUE){
            $myAddressRelativeToProxy   = $_SERVER["HOST"];
        }else{
            $myAddressRelativeToProxy   = $_SERVER["SERVER_ADDR"];
        }
    }
    
    function proxy(){
        
        global $debug;
        global $requesterAddress;
        global $myAddressRelativeToProxy;
        global $myAddressRelativeToRequester;
        global $targetAddress;
        
        if($_GET['loc']){
            $location = $_GET['loc'];
        }else{
            $location = $_SERVER['PATH_INFO'];
        }
        
        if(!$targetPathPrefix){
            $targetPathPrefix = "";
        }
    
        /* Site to forward requests to.  */
        $site = $targetAddress . $targetPathPrefix . $location;
    
        
        if($debug){
            //echo($headers . "\n---\n" . $body);
            echo("--Site: " . $site . "<br />");
        }
    
        /* Request Body comes from STDIN */
        $in_body = file_get_contents('php://input');
    
        //$request = $_SERVER['REQUEST_URI'];
    
        $ch = curl_init();
    
        /* If there was a POST request, then forward that as well.*/
        if ($_SERVER['REQUEST_METHOD'] == 'POST')
        {
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST);
        }
    
        //Same for put
        if ($_SERVER['REQUEST_METHOD'] == 'PUT')
        {
            //curl_setopt($ch, CURLOPT_PUT, TRUE);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_POSTFIELDS, $in_body); //dne
            //echo( $in_body );
            //exit;
        }
    
    
        //curl_setopt($ch, CURLOPT_URL, $site . $request);
        curl_setopt($ch, CURLOPT_URL, $site);
        curl_setopt($ch, CURLOPT_HEADER, TRUE);
    
        $headers = getallheaders();
    
        /* Translate some headers to make the remote party think we actually browsing that site. */
        $extraHeaders = array();
        if (isset($headers['Referer'])) 
        {
            $extraHeaders[] = 'Referer: '. str_replace($myAddressRelativeToProxy, $myAddressRelativeToRequester, $headers['Referer']);
        }
        if (isset($headers['Origin'])) 
        {
            $extraHeaders[] = 'Origin: '. str_replace($myAddressRelativeToProxy, $myAddressRelativeToRequester, $headers['Origin']);
        }
    
        /* Forward cookie as it came.  */
        curl_setopt($ch, CURLOPT_HTTPHEADER, $extraHeaders);
        if (isset($headers['Cookie']))
        {
            curl_setopt($ch, CURLOPT_COOKIE, $headers['Cookie']);
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    
    
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $response = curl_exec($ch);
    
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $headers = substr($response, 0, $header_size);
        $body = substr($response, $header_size);
    
        $headerArray = explode(PHP_EOL, $headers);
    
        /* Process response headers. */
        foreach($headerArray as $header)
        {
            $colonPos = strpos($header, ':');
            if ($colonPos !== FALSE) 
            {
                $headerName = substr($header, 0, $colonPos);
    
                /* Ignore content headers, let the webserver decide how to deal with the content. */
                if (trim($headerName) == 'Content-Encoding') continue;
                if (trim($headerName) == 'Content-Length') continue;
                if (trim($headerName) == 'Transfer-Encoding') continue;
                if (trim($headerName) == 'Location') continue;
                /* -- */
                /* Change cookie domain for the proxy */
                if (trim($headerName) == 'Set-Cookie')
                {
                    $header = str_replace('domain='.$myAddressRelativeToRequester, 'domain='.$myAddressRelativeToProxy, $header);
                }
                /* -- */
    
            }
            header($header, FALSE);
        }
    
    
        echo $body;
        curl_close($ch);
    }
    
    config();
    proxy();
    
    if($debug){
    
        echo("requesterAddress" . $requesterAddress . '<br />');
        echo("myARTR:" . $myAddressRelativeToRequester . '<br />');
        echo("myARTP:" . $myAddressRelativeToProxy . '<br />');
        echo("targetAddress:" . $targetAddress . '<br />');
        /**
        * [Request To Be Proxied]
        *      (normal shit)               //HTTP_X_FORWARDED_FOR
        *          <->
        *      (myExternalAddress)         //HOST
        * [Proxy]
        *      (myAddressRelativeToProxy) //HOST if external target, SERVER_ADDR if internal 
        *          <-> 
        *      (targetAddress)             //Configured
        * [Target Address]
        */
    
    }

?>