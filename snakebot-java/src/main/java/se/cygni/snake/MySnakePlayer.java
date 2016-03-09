package se.cygni.snake;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import se.cygni.snake.api.event.GameEndedEvent;
import se.cygni.snake.api.event.GameStartingEvent;
import se.cygni.snake.api.event.MapUpdateEvent;
import se.cygni.snake.api.event.SnakeDeadEvent;
import se.cygni.snake.api.exception.InvalidPlayerName;
import se.cygni.snake.api.model.GameMode;
import se.cygni.snake.api.model.GameSettings;
import se.cygni.snake.api.model.SnakeDirection;
import se.cygni.snake.api.response.PlayerRegistered;
import se.cygni.snake.client.AnsiPrinter;
import se.cygni.snake.client.BaseSnakeClient;

public class MySnakePlayer extends BaseSnakeClient {

    private static Logger log = LoggerFactory
            .getLogger(MySnakePlayer.class);

    private AnsiPrinter ansiPrinter;


    public static void main(String[] args) {

        Runnable task = () -> {

            MySnakePlayer sp = new MySnakePlayer();
            log.info("Connecting to {}:{}", sp.getServerHost(), sp.getServerPort());
            sp.connect();

            do {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } while (sp.isPlaying());
        };

        Thread thread = new Thread(task);
        thread.start();
    }

    public MySnakePlayer() {
    }

    @Override
    public void onMapUpdate(MapUpdateEvent mapUpdateEvent) {
        ansiPrinter.printMap(mapUpdateEvent);
        registerMove(mapUpdateEvent.getGameTick(), SnakeDirection.DOWN);
    }

    @Override
    public void onInvalidPlayerName(InvalidPlayerName invalidPlayerName) {

    }

    @Override
    public void onSnakeDead(SnakeDeadEvent snakeDeadEvent) {

    }

    @Override
    public void onGameEnded(GameEndedEvent gameEndedEvent) {
        log.debug("GameEndedEvent: " + gameEndedEvent);
    }

    @Override
    public void onGameStarting(GameStartingEvent gameStartingEvent) {
        log.debug("GameStartingEvent: " + gameStartingEvent);
        ansiPrinter = new AnsiPrinter(true);
    }

    @Override
    public void onPlayerRegistered(PlayerRegistered playerRegistered) {
        log.info("PlayerRegistered: " + playerRegistered);

//        try {
//            Thread.sleep(2500);
//        } catch (Exception e) {}
        startGame();
    }

    @Override
    public String getServerHost() {
        return "localhost";
    }

    @Override
    public void onSessionClosed() {
        log.debug("session closed");
    }

    @Override
    public void onConnected() {
        log.info("Connected, registering for training...");
        GameSettings gameSettings = new GameSettings.GameSettingsBuilder()
                .withWidth(50)
                .withHeight(25)
                .withMaxNoofPlayers(5)
                .build();

        registerForGame(gameSettings);
    }

    @Override
    public String getName() {
        return "#emil";
    }

    @Override
    public String getColor() {
        return "black";
    }

    @Override
    public int getServerPort() {
        return 8080;
    }

    @Override
    public GameMode getGameMode() {
        return GameMode.training;
    }
}
