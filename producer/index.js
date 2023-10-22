import { Kafka } from 'kafkajs';
import { v4 as UUID } from 'uuid';
console.log("*** Producer starts... ***");

const kafka = new Kafka({
    clientId: 'my-checking-client',
    brokers: ['localhost:9092']
});

const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

const run = async () => {
    // Producing
    await producer.connect()

    // setInterval needs to be given a call-back function that the environment can call later
    // => you'll have to give a function definition = function object, can't just call

    setInterval(() => {
        queueMessage();
    }, 2500)
}
run().catch(console.error);


const idNumbers = [
    "311299-999X",
    "010703A999Y",
    "240588+9999",
    "NNN588+9999",
    "112233-9999",
    "300233-9999",
    "30233-9999"
]

function randomizeIntegerBetween(from, to) {
    return (Math.floor(Math.random() * (to - from + 1))) + from;
}


async function queueMessage() {
    const uuidFraction = UUID().substring(0, 4);

    const success =

        await producer.send({
            topic: 'tobechecked',
            messages: [
                {
                    key: uuidFraction,
                    value: Buffer.from(idNumbers[randomizeIntegerBetween(0, idNumbers.length - 1)]),
                },
            ],
        }
        );

    if (success) {
        console.log(`Message ${uuidFraction} succesfully to the stream`);
    } else {
        console.log('Problem writing to the stream...');
    }
}