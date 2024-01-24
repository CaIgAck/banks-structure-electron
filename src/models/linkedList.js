// linkedList.js

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    addNode(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    removeNode() {
        if (!this.head) {
            return null;
        }
        const removedNode = this.head;
        this.head = this.head.next;
        removedNode.next = null;
        return removedNode.data;
    }

    findNodeByData(data) {
        let current = this.head;

        while (current) {
            if (current.data === data) {
                return current;
            }

            current = current.next;
        }

        return null; // Элемент с указанными данными не найден
    }
}

module.exports = LinkedList;
