<cfcomponent displayName="Simple HelloWorld component" output="false">

    <cffunction name="sayHello" access="remote" output="false" returnType="string">
        <cfargument name="nom" required="true" type="string" />
        <cfreturn "Hello, " & trim(arguments.nom) & "." />
    </cffunction>

    <cffunction name="sampleCFScript" access="remote" output="false" returnType="string">
        <cfargument name="nom" required="true" type="string" />

        <cfquery name = "SampleQuery" datasource = "MyTestDataSource">
            SELECT FirstName, LastName
            FROM Customers
            WHERE ID > 1000
        </cfquery>

        <CFSCRIPT>
            x = 1;
            y = 20;
            result = x + y;
            writeDump(x); 
        </cfscript>
    </cffunction>

    <cffunction name="sampleCFQuery" access="remote" output="false" returnType="string">
        <cfquery name = "SampleQuery" datasource = "MyTestDataSource">
            SELECT FirstName, LastName
            FROM Customers
            WHERE ID > 1000
        </CFQUERY>
    </cffunction>

</cfcomponent>