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

public class ExampleSnakePlayer extends BaseSnakeClient {

    private static Logger log = LoggerFactory
            .getLogger(ExampleSnakePlayer.class);

    private AnsiPrinter ansiPrinter;


    public static void main(String[] args) {

        Runnable task = () -> {

            ExampleSnakePlayer sp = new ExampleSnakePlayer();
            sp.connect();

            // Keep this process alive as long as the
            // Snake is connected and playing.
            do {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            } while (sp.isPlaying());

            log.info("Shutting down");
        };


        Thread thread = new Thread(task);
        thread.start();
    }

    public ExampleSnakePlayer() {
        ansiPrinter = new AnsiPrinter(true);
    }

    @Override
    public void onMapUpdate(MapUpdateEvent mapUpdateEvent) {
        ansiPrinter.printMap(mapUpdateEvent);

        // Choose action here!
        registerMove(mapUpdateEvent.getGameTick(), SnakeDirection.DOWN);
    }

    @Override
    public void onInvalidPlayerName(InvalidPlayerName invalidPlayerName) {

    }

    @Override
    public void onSnakeDead(SnakeDeadEvent snakeDeadEvent) {
        log.info("A snake {} died by {}",
                snakeDeadEvent.getPlayerId(),
                snakeDeadEvent.getDeathReason());
    }

    @Override
    public void onGameEnded(GameEndedEvent gameEndedEvent) {
        log.debug("GameEndedEvent: " + gameEndedEvent);
    }

    @Override
    public void onGameStarting(GameStartingEvent gameStartingEvent) {
        log.debug("GameStartingEvent: " + gameStartingEvent);
    }

    @Override
    public void onPlayerRegistered(PlayerRegistered playerRegistered) {
        log.info("PlayerRegistered: " + playerRegistered);

        // Disable this if you want to start the game manually from
        // the web GUI
        startGame();
    }

    @Override
    public void onSessionClosed() {
        log.info("Session closed");
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

    /**
     * Note, color is currently not used.
     *
     * @return
     */
    @Override
    public String getColor() {
        return "black";
    }

    @Override
    public String getServerHost() {
        return "snake.cygni.se";
    }

    @Override
    public int getServerPort() {
        return 80;
    }

    @Override
    public GameMode getGameMode() {
        return GameMode.training;
    }
}
