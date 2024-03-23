------------
Create Table
------------
Test table for DynamoDB

* Table Name: test_payment
* Refer database.md for rest of table details



-----------------
Create IAM policy
-----------------
* Create Your Own Policy -> Select 'JSON'
* Name: `test-policy-payment`
* Description: Test policy for payment - AWS DynamoDB
* Policy Document:
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUserToAccessTestTable",
      "Effect": "Allow",
      "Action": [
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:ConditionCheckItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:UpdateTable"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/test_payment",
        "arn:aws:dynamodb:*:*:table/test_payment/*"
      ]
    }

  ]
}
```



---------------
Create IAM User
---------------
* Name: `test-user`
* Access type: Programmatic access
* Attach existing policies directly: `test-policy-payment`
* Note down AWS Key and Secret
